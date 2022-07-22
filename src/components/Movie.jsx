import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";

const Movie = ({ movie }) => {
  const [like, setLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [movies, setMovies] = useState([]);
  const { user } = UserAuth();
  const movieId = doc(db, "Users", `${user?.email}`);
  useEffect(() => {
    onSnapshot(movieId, (doc) => {
      const myMovies = doc.data()?.savedMovies;
      setMovies(myMovies);
      if (myMovies != null && myMovies.length > 0) {
        const filteredMovies = myMovies.filter(
          (item) => item?.id === movie?.id
        );
        if (filteredMovies.length > 0) {
          setLike(true);
          setSaved(true);
        }
      }
    });
  }, [movies]);
  const saveMovie = async () => {
    if (user?.email) {
      if (!like) {
        const item = {
          id: movie?.id,
          title: movie?.title,
          img: movie?.backdrop_path,
        };
        setMovies(movies.concat(item));
        await updateDoc(movieId, {
          savedMovies: arrayUnion(item),
        });
      } else {
        try {
          const result = movies.filter((item) => item.id !== movie?.id);
          setMovies(result);
          await updateDoc(movieId, {
            savedMovies: result,
          });
        } catch (error) {
          console.log(error);
        }
      }
      setLike(!like);
      setSaved(!saved);
    } else {
      alert("Please login to save movies...");
    }
  };
  return (
    <div className="w-[160px] sm:w-[200px] md:wd-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2">
      <img
        className="w-full h-auto block"
        src={`https://image.tmdb.org/t/p/w500/${movie?.backdrop_path}`}
        alt={movie?.title}
      />
      <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
        <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
          {movie?.title}
        </p>
        <p onClick={saveMovie}>
          {like ? (
            <FaHeart className="absolute top-4 left-4 text-gray-300" />
          ) : (
            <FaRegHeart className="absolute top-4 left-4 text-gray-300" />
          )}
        </p>
      </div>
    </div>
  );
};

export default Movie;
