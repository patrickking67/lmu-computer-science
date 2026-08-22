import exercises from '../data/exercises.json';
import ExerciseCard from './ExerciseCard';

const RoutineModal = ({ toggleModal, currentDay }) => {

  return (
    <div onClick={toggleModal} tabIndex="-1" className="z-50 p-2 absolute top-0 left-0 w-screen h-screen grid place-items-center bg-[rgba(0,0,0,0.5)]">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow flex flex-col justify-center">
        <div className="flex justify-between p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            Day {currentDay.index}: {currentDay.name}
          </h3>
          <button onClick={toggleModal} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center " data-modal-toggle="defaultModal">
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="max-h-[600px] overflow-scroll grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 scrollbar-hide justify-center items-center">
          {currentDay.name == 'Rest' ? <h1>Enjoy your rest day!</h1> : currentDay.exercises.map(exerciseData => {
            const exercise = exercises.find(e => e.id == exerciseData.id);
            if (!exercise) return;
            return <ExerciseCard key={exerciseData.id} exercise={exercise} exerciseData={exerciseData} />;
          })}
        </div>
        <div className="flex items-center p-5 space-x-2 border-t border-gray-200 rounded-b">
          <button onClick={toggleModal} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-nonefont-medium rounded-lg text-sm px-5 py-2.5 text-center">Done Editing</button>
        </div>
      </div>
    </div>
  );
};

export default RoutineModal;
