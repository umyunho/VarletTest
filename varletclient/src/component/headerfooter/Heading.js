import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import '../../style/header.css';

function Heading() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [profileImg, setProfileImg] = useState('http://localhost:8070/images/user.png');
    const dispatch = useDispatch();
    const userCookie = getCookie('user');
    
    const LoginWindow = () => {
        navigate('/login');
    };
  
    const JoinWindow = () => {
        navigate('/join');
    };

    const logout = () => {
        dispatch(logoutAction());
        removeCookie("user");
        alert('로그아웃되었습니다');
        navigate('/');
    };

    const logCheck = (src) => {
        if (!userCookie) {
            navigate('/login');
        } else {
            navigate(src);
        }
    };


    useEffect(() => {
        if (!userCookie) return;

        const userid = getCookie('user').userid;
        axios.get(`/api/member/getMyProfileImg/${userid}`, { 
            params: {
                userid: userid,  // 필요한 추가 정보
            },
        })
        .then((result) => {
            const profileImgUrl = result.data.profileImgUrl;
            if (profileImgUrl) {
                setProfileImg(profileImgUrl);
                console.log('Profile Image URL:', profileImgUrl); // 디버깅 로그
            } else {
                setProfileImg('http://localhost:8070/images/user.png'); // 기본 이미지로 설정
            }
        })
        .catch((err) => {
            console.error( err);
        });
    }, [userCookie]);

    const handleNicknameClick = () => {
        navigate('/myPage');
    };

    return (
        <div className='header'>
            <div className='category_menu'>
                <div className='logo'>
                    <img 
                        src="http://localhost:8070/images/varlet.png" 
                        onClick={() => navigate('/')} 
                        alt="Logo"
                    />
                </div>
                <div className='contents' onClick={() => navigate('/contentsList')}>놀거리</div>
                <div className='rcommunity' onClick={() => navigate('/recommendWrite')}>여행 코스 의뢰</div>
                <div className='reviewBoard' onClick={() => navigate('/reviewList')}>여행 후기</div>
                <div className='mycourse' onClick={() => logCheck('/mycourse')}>여행 코스 만들기</div>
                <div className='mycourse' onClick={() => alert('준비중입니다.')}>숙소</div>
                
                <div className='auth-buttons'>
                    {!userCookie && <div className='login' onClick={LoginWindow}>로그인</div>}
                    {!userCookie && <div className='line'></div>}
                    {!userCookie && <div className='join' onClick={JoinWindow}>회원가입</div>}
                </div>
                <div className='loginUserInfo'>
                {userCookie && (
                    <>
                        <div className='profileimg'>
                            <img src={profileImg}  />
                        </div>
                        <div className='myinfo' onClick={handleNicknameClick}>
                            {userCookie.nickname}님
                        </div>
                        <div className='line'></div>
                        <div className='logout' onClick={logout}>로그아웃</div>
                        <div className='mypoint' > 보유 포인트 : {userCookie.point}</div>
                    </>
                )}
                </div>
            </div>
        </div>
    );
}

export default Heading;
