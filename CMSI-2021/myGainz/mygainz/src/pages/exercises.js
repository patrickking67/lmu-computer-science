import React, { useEffect } from "react";
import { useState } from "react";
import exerciseData from "../data/exercises.json";
import ExerciseCard from "../components/ExerciseCard";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import { IoSearch } from "react-icons/io5";

export default function Exercises() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState(exerciseData);

  const nextPage = () => {
    if (((exercises.length - (exercises.length % 12)) <= page * 12)) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page === 0) return;
    setPage(page - 1);
  };

  useEffect(() => {
    const waitForTyping = setTimeout(() => {
      setPage(0);
      setExercises(
        exerciseData.filter((exercise) => {
          const toCheck = `${exercise.name} ${exercise.equipment} ${exercise.target}`;
          return toCheck.toLowerCase().includes(search.toLowerCase());
        })
      );
    }, 1000);

    return () => clearTimeout(waitForTyping);
  }, [search]);

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="space-y-1">
        <h1 className="page-header">Exercises</h1>
        <h2 className="page-header text-gray-400 text-lg">
          <span className="page-header text-gray-500 text-lg font-medium">
            Page {page + 1}/{Math.ceil(exercises.length / 12)}
          </span>{" "}
          ({exercises.length} total results)
        </h2>
      </div>
      <div className="flex justify-end items-center relative rounded-lg border-2 bg-gray-100 border-gray-200 px-4 py-3 focus:outline-blue-500">
        <input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, muscle group, or equipment..."
          className="w-full h-full focus:outline-none text-gray-600 bg-gray-100"
        />
        <IoSearch className="fill-gray-400 ml-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 overflow-scroll scrollbar-hide h-full">
        {exercises.slice(page * 12, (page + 1) * 12).map((exercise) => {
          return <ExerciseCard key={exercise.id} exercise={exercise} />;
        })}
      </div>
      <div className="flex justify-between items-center">
        <button className="btn-animate btn-primary" onClick={prevPage}>
          <RxDoubleArrowLeft />
          Prev
        </button>
        <p className="text-gray-400 select-none hidden md:inline">
          Showing 12 per page
        </p>
        <button className="btn-primary btn-animate lg:col-start-4" onClick={nextPage}>
          Next
          <RxDoubleArrowRight />
        </button>
      </div>
    </div>
  );
}
