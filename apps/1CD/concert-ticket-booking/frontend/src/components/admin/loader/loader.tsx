import React from 'react';
import css from './loader.module.css';

const Loader = () => {
  return (
    <div className="flex justify-center flex-col items-center">
      <div className={css.loader}></div>
      <p>Please wait</p>
    </div>
  );
};

export default Loader;
