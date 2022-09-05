import React, { memo } from 'react';
import { NotLogin } from './style';

export default memo(function JMMine() {
  let isLogin = false;
  return (
    <div>
      <NotLogin isLogin={isLogin} className="w980">
        <div className="show-no-login">
          <div className="not-login inner">
            <h2>Login to NetEase Music</h2>
            <div className="detail">
            You can follow the stars and friends to taste their private song list
            Discover more great music through their dynamic
            </div>
            <div className="not-login btn-login">Login</div>
          </div>
        </div>
      </NotLogin>
    </div>
  );
});
