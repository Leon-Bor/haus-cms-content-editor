import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { env } from 'environment';
import { Settings } from '../../haus-cms/src/models/classes/settings.model';
import { FlagSvg } from './components/flag-svg/flag-svg';
import { LockAuth } from './components/lock-auth/lock-auth';
import { setCookie } from './helper';

export const App = () => {
  const [settings, setSettings] = useState<Settings>(
    (window as any)?.hausSettings || {
      i18nLanguages: ['de-DE', 'en-US'],
    }
  );
  const [isAuth, setIsAuth] = useState(
    (localStorage.getItem('hausAddminToken') && settings?.adminToken === localStorage.getItem('hausAAinToken')) || false
  );
  const [isEditiing, setIsEditiing] = useState(false);
  const [isSelectingLang, setIsSelectingLang] = useState(false);
  const [editedContent, setEditedContent] = useState({});
  const [originalContent, setOriginalContent] = useState<any>({});

  const baseBackendUrl = settings.adminPath ? env.backendUrl + '/' + settings.adminPath : env.backendUrl + '/haus-admin';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const edit = urlParams.get('edit');
    setCookie('hausEdit', edit + '', 365);

    //testing stugg

    console.log('env', env);
    console.log('settings', settings);
    console.log('isAuth', isAuth);
  }, []);

  const setEditing = (bool: boolean, acceptContent = false) => {
    if (bool) {
      setIsEditiing(true);
      console.log($);
      $('[data-haus-id]').attr('contenteditable', 'true');
      $('[data-haus-img]').attr('imageeditable', 'true');
      $('[data-haus-id]').on('input', function (this: any): void {
        console.log('Content changed: ' + $(this).attr('data-haus-id'));
        setEditedContent({ ...this.editedContent, [$(this).attr('data-haus-id') as string]: $(this).html() });
      });
      $('[data-haus-id]').on('focus', function (this: any): void {
        $(this).addClass('haus-element--focused');
        setOriginalContent({
          ...originalContent,
          [$(this).attr('data-haus-id') as string]: $(this).html(),
        });
      });
      $('[data-haus-id]').on('blur', function (this: any): void {
        $(this).removeClass('haus-element--focused');
      });
    } else {
      setIsEditiing(false);
      $('[data-haus-id]').removeAttr('contenteditable');
      $('[data-haus-img]').removeAttr('imageeditable');
      if (acceptContent) {
        sendContent();
      } else {
        cancelContent();
      }
    }
  };

  const sendContent = () => {
    console.log('editedContent ', editedContent);
    $.ajax({
      type: 'POST',
      // the url where you want to sent the userName and password to
      url: baseBackendUrl + '/content',
      dataType: 'json',
      headers: {
        authorization: localStorage.getItem('hausAdminToken'),
      },
      data: { innerHtml: editedContent, image: {} },
      success: () => {
        setEditedContent({});
        setOriginalContent({});
        console.log('Content succesfull');
      },
      error: (e) => {
        console.log(e);
        alert(`There was an error. Please try again or contact your support.`);
        cancelContent();
      },
    });
  };
  const cancelContent = () => {
    console.log('originalContent ', originalContent);
    Object.keys(originalContent).map((k) => {
      $(`[data-haus-id=${k}]`).html(originalContent[k]);
    });
    setEditedContent({});
    setOriginalContent({});
  };

  const authenticate = () => {
    return new Promise((res, rej) => {
      $.ajax({
        type: 'POST',
        url: baseBackendUrl + '/authenticate',
        dataType: 'json',
        headers: {
          authorization: localStorage.getItem('hausAdminToken'),
        },
        success: (setting) => {
          setSettings(settings);
          setIsAuth(true);
          res(setting);
        },
        error: () => {
          res(false);
        },
      });
    });
  };

  return (
    <div className='haus-editor'>
      {isAuth ? (
        <>
          <div className='haus-actions'>
            <div
              style={{ left: '0px' }}
              className={`haus-icon haus-edit-icon ${isEditiing ? 'haus-icon--hide' : ''}`}
              onClick={() => setEditing(true)}
            >
              <svg x='0px' y='0px' viewBox='0 0 528.899 528.899'>
                <path
                  d='M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
          c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
          C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
          L27.473,390.597L0.3,512.69z'
                />
              </svg>
            </div>
            <div
              style={{ left: '0px' }}
              className={`haus-icon haus-cancel-icon ${!isEditiing ? 'haus-icon--hide' : ''}`}
              onClick={() => {
                setEditing(false, false);
                setIsSelectingLang(false);
              }}
            >
              <svg x='0px' y='0px' viewBox='0 0 24 24'>
                <path d='m14.828 12 5.303-5.303c.586-.586.586-1.536 0-2.121l-.707-.707c-.586-.586-1.536-.586-2.121 0l-5.303 5.303-5.303-5.304c-.586-.586-1.536-.586-2.121 0l-.708.707c-.586.586-.586 1.536 0 2.121l5.304 5.304-5.303 5.303c-.586.586-.586 1.536 0 2.121l.707.707c.586.586 1.536.586 2.121 0l5.303-5.303 5.303 5.303c.586.586 1.536.586 2.121 0l.707-.707c.586-.586.586-1.536 0-2.121z' />
              </svg>
            </div>
            <div
              style={{ left: isEditiing ? '65px' : '0px' }}
              className={`haus-icon haus-accept-icon ${!isEditiing ? 'haus-icon--hide' : ''}`}
              onClick={() => {
                setEditing(false, true);
                setIsSelectingLang(false);
              }}
            >
              <svg x='0px' y='0px' viewBox='0 0 24 24'>
                <g>
                  <path d='m9.707 19.121c-.187.188-.442.293-.707.293s-.52-.105-.707-.293l-5.646-5.647c-.586-.586-.586-1.536 0-2.121l.707-.707c.586-.586 1.535-.586 2.121 0l3.525 3.525 9.525-9.525c.586-.586 1.536-.586 2.121 0l.707.707c.586.586.586 1.536 0 2.121z' />
                </g>
              </svg>
            </div>
          </div>
          {settings?.enableI18n ? (
            <div className='haus-actions'>
              <div
                style={{ left: '0px' }}
                className={`haus-icon haus-language-icon ${isEditiing ? 'haus-icon--hide' : ''}`}
                onClick={() => {
                  setIsSelectingLang(!isSelectingLang);
                }}
              >
                <svg viewBox='0 0 512 512'>
                  <path
                    d='M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.332,0,187.62,0,256
         s26.629,132.668,74.98,181.02C123.333,485.371,187.62,512,256,512s132.667-26.629,181.02-74.98
         C485.371,388.668,512,324.38,512,256S485.371,123.332,437.02,74.98z M207.449,35.268c-8.587,8.353-17.868,18.307-27.154,29.893
         c-16.058,20.037-29.429,41.603-39.887,64.282h-71.56C100.811,82.328,150.083,47.876,207.449,35.268z M51.695,159.443h76.819
         c-8.743,26.116-13.829,53.433-15.157,81.557H30.51C32.421,211.991,39.823,184.462,51.695,159.443z M30.51,271h82.847
         c1.328,28.124,6.413,55.441,15.157,81.557H51.695C39.823,327.538,32.421,300.009,30.51,271z M68.848,382.557h71.56
         c10.458,22.678,23.829,44.245,39.887,64.282c9.285,11.586,18.566,21.54,27.154,29.893
         C150.083,464.124,100.811,429.672,68.848,382.557z M241,466.806c-10.683-9.211-23.966-22.096-37.295-38.728
         c-11.657-14.546-21.64-29.735-29.957-45.521H241V466.806z M241,352.557h-80.782c-9.751-25.825-15.367-53.063-16.823-81.557H241
         V352.557z M241,241h-97.605c1.457-28.49,7.08-55.727,16.835-81.557H241V241z M241,129.443h-67.252
         c8.146-15.462,17.894-30.351,29.243-44.627C216.49,67.837,230.087,54.644,241,45.236V129.443z M481.49,241h-82.847
         c-1.328-28.124-6.413-55.441-15.157-81.557h76.819C472.177,184.462,479.58,211.991,481.49,241z M443.152,129.443h-71.56
         c-10.458-22.678-23.829-44.245-39.887-64.282c-9.285-11.586-18.566-21.54-27.154-29.893
         C361.918,47.876,411.19,82.328,443.152,129.443z M271,45.194c10.683,9.211,23.966,22.096,37.295,38.728
         c11.657,14.546,21.64,29.735,29.958,45.521H271V45.194z M271,159.443h80.782c9.752,25.825,15.367,53.063,16.823,81.557H271
         V159.443z M271,271h97.604c-1.457,28.49-7.08,55.727-16.835,81.557H271V271z M271,466.763v-84.206h67.252
         c-8.146,15.462-17.894,30.351-29.243,44.626C295.51,444.162,281.914,457.354,271,466.763z M304.552,476.732
         c8.587-8.353,17.868-18.307,27.154-29.893c16.058-20.037,29.429-41.603,39.887-64.282h71.56
         C411.19,429.672,361.918,464.124,304.552,476.732z M460.305,352.557h-76.819c8.743-26.116,13.829-53.433,15.157-81.557h82.847
         C479.58,300.009,472.177,327.538,460.305,352.557z'
                  />
                </svg>
                {localStorage.getItem('haus-i18nLanguage') && (
                  <div className='haus-current-lang'>
                    <FlagSvg i18n={localStorage.getItem('haus-i18nLanguage')} />
                  </div>
                )}
              </div>
              {settings?.i18nLanguages?.map((l, i) => {
                return (
                  <div
                    key={i}
                    style={{ left: isSelectingLang ? 65 * (i + 1) + 'px' : '0px', zIndex: 1000000025 - i }}
                    className={`haus-lang ${!isSelectingLang || isEditiing ? 'haus-lang--hide' : ''}`}
                    onClick={() => {
                      setIsSelectingLang(false);
                      var url = new URL(window.location.href);
                      url.searchParams.set('language', l);
                      window.location.href = url.toString();
                      localStorage.setItem('haus-i18nLanguage', l);
                    }}
                  >
                    <FlagSvg i18n={l} />
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      ) : (
        <LockAuth
          isAuth={isAuth}
          onAuthenticate={async () => {
            return await authenticate();
          }}
        />
      )}
    </div>
  );
};
