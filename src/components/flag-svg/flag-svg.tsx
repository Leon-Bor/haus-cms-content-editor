import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { env } from 'environment';
import './flag-svg.scss';
import Germany from '../../assets/country-flags/germany.svg';
import England from '../../assets/country-flags/england.svg';
import Usa from '../../assets/country-flags/united-states-of-america.svg';

interface IProps {
  i18n: string | null;
}
export const FlagSvg = ({ i18n }: IProps): JSX.Element => {
  const getFlag = () => {
    switch (i18n) {
      case 'en':
        return <England />;
      case 'en-GB':
        return <Usa />;
      case 'en-US':
        return <Usa />;
      case 'de':
        return <Germany />;
      case 'de-DE':
        return <Germany />;
      default:
        return null;
    }
  };

  return <div className='haus-flag-svg'>{getFlag()}</div>;
};
