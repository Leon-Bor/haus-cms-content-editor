import React, { useEffect, useState } from 'react';
import './lock-auth.scss';

interface IProps {
  isAuth: boolean;
  onAuthenticate: Function;
}
export const LockAuth = ({ isAuth, onAuthenticate }: IProps): JSX.Element => {
  const [isHover, setIshover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hausAdminToken') && !isAuth) {
      onAuthenticate();
    }
  }, []);

  const onAuth = async () => {
    if (value && value.replace(/\s/g, '') != '') {
      setError(false);
      localStorage.setItem('hausAdminToken', value);
      const res = await onAuthenticate();
      if (res) {
        setValue('');
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className={`haus-lock-auth ${error ? 'haus-lock-auth--error' : ''}`}>
      <div
        className='haus-lock-auth__icon'
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => {
          setIshover(true);
        }}
        onMouseLeave={() => {
          setIshover(false);
        }}
      >
        {isHover ? (
          <svg viewBox='0 0 426.667 426.667'>
            <path
              d='M320,192H149.333v-85.333c0-35.285,28.715-64,64-64s64,28.715,64,64V128H320v-21.333C320,47.851,272.149,0,213.333,0
			S106.667,47.851,106.667,106.667V192C83.136,192,64,211.115,64,234.667V384c0,23.531,19.136,42.667,42.667,42.667H320
			c23.552,0,42.667-19.136,42.667-42.667V234.667C362.667,211.115,343.552,192,320,192z M213.333,341.333c-17.664,0-32-14.336-32-32
			s14.336-32,32-32s32,14.336,32,32S230.997,341.333,213.333,341.333z'
            />
          </svg>
        ) : (
          <svg viewBox='0 0 426.667 426.667'>
            <path
              d='M320,192v-85.333C320,47.851,272.128,0,213.333,0c-58.837,0-106.667,47.851-106.667,106.667V192
     C83.136,192,64,211.115,64,234.667V384c0,23.531,19.136,42.667,42.667,42.667H320c23.531,0,42.667-19.136,42.667-42.667V234.667
     C362.667,211.115,343.531,192,320,192z M213.333,341.333c-17.664,0-32-14.336-32-32s14.336-32,32-32s32,14.336,32,32
     S230.997,341.333,213.333,341.333z M277.333,192h-128v-85.333c0-35.285,28.715-64,64-64s64,28.715,64,64V192z'
            />
          </svg>
        )}
      </div>
      <div className='haus-lock-auth__input' style={{ maxWidth: isOpen ? '500px' : '50px', padding: isOpen ? (null as any) : '0px' }}>
        <input
          placeholder={'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}
          onFocus={() => {
            setError(false);
          }}
          onChange={(e) => {
            setValue(e?.target?.value);
          }}
        />
        <div className='haus-lock-auth__send' onClick={() => onAuth()}>
          <svg viewBox='0 0 100 100'>
            <g transform='matrix(1.26,0,0,1.26,-12.987760429382291,-12.999132156372063)'>
              <path
                xmlns='http://www.w3.org/2000/svg'
                d='m50 10.75c-18.266 0-34.562 13.129-38.383 31.007-1.909 8.933-.623 18.432 3.636 26.515 4.099 7.779 10.819 14.066 18.859 17.629 8.363 3.707 17.964 4.353 26.754 1.825 8.48-2.438 15.999-7.789 21.118-14.972 10.703-15.017 9.272-36.111-3.32-49.567-7.38-7.886-17.862-12.437-28.664-12.437zm18.829 41.347-10.7 10.958c-2.709 2.775-6.991-1.429-4.293-4.191l5.399-5.529h-25.586c-1.817 0-3.333-1.517-3.333-3.333s1.517-3.333 3.333-3.333h25.458l-5.506-5.505c-2.736-2.736 1.506-6.979 4.242-4.243l10.961 10.96c1.162 1.161 1.173 3.041.025 4.216z'
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
