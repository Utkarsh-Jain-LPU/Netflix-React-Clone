import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";

const SavedShows = () => {
  const sliderVal = 800;
  const [movies, setMovies] = useState([]);
  const { user } = UserAuth();
  const movieId = doc(db, "Users", `${user?.email}`);
  useEffect(() => {
    onSnapshot(movieId, (doc) => {
      setMovies(doc.data()?.savedMovies);
    });
  }, [user?.email]);
  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft -= sliderVal;
  };
  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft += sliderVal;
  };
  const deleteMovie = async (id) => {
    try {
      const result = movies.filter((item) => item.id !== id);
      await updateDoc(movieId, {
        savedMovies: result,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h2 className="text-white font-bold md:text-xl p-4">My Shows</h2>
      <div className="relative flex items-center group">
        <MdChevronLeft
          size={40}
          onClick={slideLeft}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
        />
        <div
          id={"slider"}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          {movies.map((movie, key) => {
            return (
              <div
                key={key}
                className="w-[160px] sm:w-[200px] md:wd-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2"
              >
                <img
                  className="w-full h-auto block"
                  src={`https://image.tmdb.org/t/p/w500/${movie?.img}`}
                  alt={movie?.title}
                />
                <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
                  <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
                    {movie?.title}
                  </p>
                  <p
                    className="absolute top-4 right-4 text-gray-300"
                    onClick={() => {
                      deleteMovie(movie?.id);
                    }}
                  >
                    <AiOutlineClose />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <MdChevronRight
          size={40}
          onClick={slideRight}
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
        />
      </div>
    </>
  );
};

export default SavedShows;
