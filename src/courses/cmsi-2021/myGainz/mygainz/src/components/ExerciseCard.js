import { useEffect, useState } from "react";

export default function ExerciseCard({ exercise, exerciseData  }) {

  const handleChange = async (e) => {
    exerciseData[e.target.id] = e.target.value;
  };

  return <div className="bg-gray-100 aspect-square p-4 rounded-lg flex flex-col gap-y-3">
    <div>
      <p className="text-gray-500 font-sans capitalize font-medium truncate text-md">{exercise.name}</p>
      <p className="text-gray-400 font-sans capitalize font-regular truncate text-md">{exercise.equipment}</p>
      <p className="text-gray-400 font-sans capitalize font-regular truncate text-md">Target Muscle: <span className="text-red-600">{exercise.target}</span></p>
    </div>
    {exerciseData &&
      <div className="flex gap-3">
        <div>
          <label className="text-sm text-gray-500" htmlFor="sets">Sets</label>
          <input onChange={(e) => handleChange(e)} defaultValue={exerciseData.sets > 0 ? exerciseData.sets : ''} placeholder="0" id="sets" className="rounded-md border-2 border-slate-200 focus:outline-none p-2 text-gray-500 w-full" />
        </div>
        <div>
          <label className="text-sm text-gray-500" htmlFor="sets">Reps</label>
          <input onChange={(e) => handleChange(e)} defaultValue={exerciseData.reps > 0 ? exerciseData.reps : ''} placeholder="0" id="reps" className="rounded-md border-2 border-slate-200 focus:outline-none p-2 text-gray-500 w-full" />
        </div>
        <div>
          <label className="text-sm text-gray-500" htmlFor="sets">Weight</label>
          <input onChange={(e) => handleChange(e)} defaultValue={exerciseData.weight > 0 ? exerciseData.weight : ''} placeholder="0" id="weight" className="rounded-md border-2 border-slate-200 focus:outline-none p-2 text-gray-500 w-full" />
        </div>

      </div>
    }
    <img src={exercise.gifUrl} alt="gif" className="rounded-lg bg-white border-2 border-slate-200 aspect-square w-full" />
  </div>;
}