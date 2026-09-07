import React from 'react';
import Employment from './SocialSubFolder/Employment';
import GovernanceBodies from './SocialSubFolder/GovernanceBodies';

export default function newSocial() {
  return (
    <div className="flex flex-row ">
      <Employment></Employment>
      <GovernanceBodies></GovernanceBodies>
    </div>
  );
}
