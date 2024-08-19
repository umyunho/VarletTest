import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { location1Data, location2Data } from '../request/LocaionData';
import { getCookie } from "../../util/cookieUtil";
import { useSelector } from 'react-redux';

function MyRequest() {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [isLocation2Visible, setIsLocation2Visible] = useState(false);
  const [searching, setSearching] = useState(false); 
  const navigate = useNavigate();
  const loginUser = useSelector(state => state.user);
  const userid = getCookie('user').userid; 

  useEffect(() => {
    fetchPostsByUserId();
  }, []);

  const fetchPostsByUserId = async () => {
    try {
      const result = await axios.get(`/api/rcommunity/getMyList/${userid}`);
      const postsList = result.data.postlist;
      // 역순으로 정렬
      const sortedPostsList = postsList.reverse();
      setPosts(sortedPostsList);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const searchPosts = async () => {
    try {
      const result = await axios.get(`/api/rcommunity/getMyList/${userid}`, {
        params: { location }
      });
      const postsList = result.data.postlist;
      const sortedPostsList = postsList.reverse();
      setPosts(sortedPostsList);
      setIsLocation2Visible(true);
      setSearching(true);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const searchPostsByLocation2 = async () => {
    if (location && location2) {
      try {
        const result = await axios.get(`/api/rcommunity/getMyList/${userid}`, {
          params: { location, location2 }
        });
        const postsList = result.data.postlist;
        const sortedPostsList = postsList.reverse();
        setPosts(sortedPostsList);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
  };

  const cancelSearch = () => {
    setLocation('');
    setLocation2('');
    setIsLocation2Visible(false);
    setSearching(false);
    fetchPostsByUserId(); // 모든 게시글 다시 불러오기
  };

  const maskedid = (userid) => {
    return userid.length > 2 ? userid.slice(0, 2) + '****' : userid;
  };

  const requestwrite = () => {
    navigate('/rpostwrite');
  };

  const RcommunityView = (postId) => {
    navigate(`/RcommunityView/${postId}`);
  };

  const handleLocationChange = (e) => {
    setLocation(parseInt(e.target.value)); // 숫자형으로 변환하여 저장
    setLocation2('');
    setIsLocation2Visible(false);
  };

  const handleLocation2Change = (e) => {
    setLocation2(parseInt(e.target.value));
  };

  return (
    <>
      <Heading />
      <div className='w-full max-w-[1700px] mx-auto px-1 mt-28'>
        <div className='mt-28'>
          <div className='flex justify-between items-baseline'>
            <h1 className='text-3xl font-semibold'>MY REQUEST</h1>
          </div>
          <div className='w-full'>
            <ul className='mb-4'>
              <li className='flex items-center mb-4'>
                <span className='mr-4 text-lg font-medium'>지역 선택</span>
                <select
                  className='border rounded px-2 py-1'
                  value={location}
                  onChange={handleLocationChange}
                >
                  <option value="1">전체</option>
                  <option value="2">서울특별시</option>
                  <option value="3">부산광역시</option>
                  <option value="4">대구광역시</option>
                  <option value="5">인천광역시</option>
                  <option value="6">광주광역시</option>
                  <option value="7">대전광역시</option>
                  <option value="8">울산광역시</option>
                  <option value="9">세종특별자치시</option>
                  <option value="10">경기도</option>
                  <option value="11">강원도</option>
                  <option value="12">충청북도</option>
                  <option value="13">충청남도</option>
                  <option value="14">전라북도</option>
                  <option value="15">전라남도</option>
                  <option value="16">경상북도</option>
                  <option value="17">경상남도</option>
                  <option value="18">제주도</option>
                </select>
                <div className="flex ml-auto space-x-4">
                  <div 
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer"
                    onClick={searchPosts}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                    <span className="text-xl font-bold">검색</span>
                  </div>

                  {searching && (
                    <div
                      className='bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer'
                      onClick={cancelSearch}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5.039 5.062a7 7 0 0 0 9.91 9.89m1.584 -2.434a7 7 0 0 0 -9.038 -9.057" />
                        <path d="M3 3l18 18" />
                      </svg>
                      <span className="text-xl font-bold">검색 취소</span>
                    </div>
                  )}

                  <div 
                    className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer"
                    onClick={requestwrite}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                    <span className="text-xl font-bold">의뢰하기</span>
                  </div>
                </div>
              </li>

              {isLocation2Visible && (
                <li className='flex items-center mb-4'>
                  <span className='mr-4 text-lg font-medium'>지역 상세</span>
                  <select
                    className='border rounded px-2 py-1'
                    value={location2}
                    onChange={handleLocation2Change}
                  >
                    <option value="">전체</option>
                    {location2Data[location]?.map((loc) => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                  <div 
                    className="ml-auto bg-blue-300 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer"
                    onClick={searchPostsByLocation2}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                    <span className="text-lg font-bold">상세 검색</span>
                  </div>
                </li>
              )}
            </ul>
            <ul>
              <li className='flex font-bold text-black border-b border-gray-300 pb-2 mb-2'>
                <span className='w-1/12 text-center'>번호</span>
                <span className='w-4/12 text-left'>제목</span>
                <span className='w-2/12 text-center'>지역</span>
                <span className='w-2/12 text-center'>상세 지역</span>
                <span className='w-2/12 text-center'>작성자</span>
                <span className='w-2/12 text-center'>작성일</span>
                <span className='w-2/12 text-center'>채택 여부</span>
                <span className='w-1/12 text-center'>조회수</span>
              </li>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <li key={post.rnum} className='flex items-center border-b border-gray-300 py-2'>
                    <span className='w-1/12 text-center bg-blue-500 text-white rounded-full px-2 py-1 text-xs'>
                      {posts.length - index}
                    </span>
                    <span className='w-4/12 text-left cursor-pointer text-blue-500' onClick={() => RcommunityView(post.rnum)}>
                      {post.title}
                    </span>
                    <span className='w-2/12 text-center'>{location1Data[post.location]}</span>
                    <span className='w-2/12 text-center'>
                      {location2Data[post.location]?.find(item => item.value === post.location2)?.label || "전체"}
                    </span>
                    <span className='w-2/12 text-center'>{maskedid(post.userid)}</span>
                    <span className='w-2/12 text-center'>
                      {new Date(post.writedate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\./g, '.').replace(/\.$/, '')}
                    </span>
                    <span className='w-2/12 text-center'>
                      {post.picked === "Y" ? "채택 완료" : (post.picked === "N" ? "채택 진행중" : "미정")}
                    </span>
                    <span className='w-1/12 text-center'>{post.views}</span>
                  </li>
                ))
              ) : (
                <p className='text-center'>게시물이 없습니다.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyRequest;
