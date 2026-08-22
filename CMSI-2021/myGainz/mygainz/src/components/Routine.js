import { FaRegTrashAlt } from 'react-icons/fa';
import { updateDoc } from '@firebase/firestore';

export default function Routine({ routines, routine, setRoutines, toggleModal, setCurrentDay, setCurrentRoutine, userRef, user }) {
  const deleteRoutine = async () => {
    routines = routines.filter(r => r != routine);
    await updateDoc(userRef, {
      programs: routines
    });
    setRoutines(routines);
  };

  return <>
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 scrollbar-hide space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <h2 className="text-2xl text-gray-700 font-medium">{routine.name}</h2>
          {user && <button onClick={deleteRoutine} className="aspect-square rounded-lg p-1.5 bg-red-600 btn-animate"><FaRegTrashAlt color="white" /></button>}
        </div>
        <h2 className="text xl text-gray-500 font-normal">{routine.days.filter(({ name }) => name.toLowerCase() != 'rest').length} day split</h2>
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap text-center w-full gap-6">
        {routine.days.map(day => {
          day.index = routine.days.indexOf(day) + 1;
          return <div key={day.index} className="space-y-2 flex-grow w-full md:w-56 xl:w-72">
            <h3 className="text-gray-600 text-sm text-left">Day {day.index}</h3>
            <button onClick={() => {
              toggleModal();
              setCurrentDay(day);
              setCurrentRoutine(routine);
            }} className="text-sm h-14 w-full rounded-md text-white bg-blue-500 p-4 btn-animate flex items-center justify-center">
              {day.name}
            </button>
          </div>;
        })}
      </div>
      <p className="text-gray-400 font-sans capitalize font-regular truncate text-md mb-4"></p>
    </div>
  </>;
}
