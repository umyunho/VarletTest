package com.himedias.varletserver.security.filter;

import com.google.gson.Gson;

import com.himedias.varletserver.dto.MemberDTO;
import com.himedias.varletserver.security.util.CustomJWTException;
import com.himedias.varletserver.security.util.JWTUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 요청 헤더에서 "Authorization" 값을 가져옵니다.
        String authHeaderStr = request.getHeader("Authorization");
        try {
            // "Bearer " 접두사를 제거하고 실제 JWT 토큰만 추출합니다.
            String accessToken = authHeaderStr.substring(7);

            // JWT 토큰을 검증하고 클레임을 추출합니다.
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            log.info("JWT claims: " + claims);

            // 클레임에서 사용자 정보를 추출합니다.
            String userid = (String) claims.get("userid");
            String pwd = (String) claims.get("pwd");
            String name = (String) claims.get("name");
            String nickname = (String) claims.get("nickname");
            String email = (String) claims.get("email");
            String phone = (String) claims.get("phone");
            String zip_code = (String) claims.get("zip_code");
            String address = (String) claims.get("address");
            String d_address = (String) claims.get("d_address");
            Timestamp indate = (Timestamp) claims.get("indate");
            Character is_login = (Character) claims.get("is_login");
            String provider = (String) claims.get("provider");
            String snsid = (String) claims.get("snsid");
            String profileimg = (String) claims.get("profileimg");
            Integer point = (Integer) claims.get("point");
            List<String> roleNames = (List<String>) claims.get("roleNames");;

            // 추출한 정보를 사용하여 MemberDTO 객체를 생성합니다.
            MemberDTO memberDTO = new MemberDTO(userid, pwd, name,nickname, email, phone, zip_code, address, d_address,indate, is_login, provider, snsid,profileimg, point,roleNames);

            log.info("-----------------------------------");
            log.info(memberDTO);
            log.info(memberDTO.getAuthorities()); // 사용자 권한을 로그에 기록합니다.

            // UsernamePasswordAuthenticationToken 객체를 생성하여 인증 정보를 설정합니다.
            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, pwd, memberDTO.getAuthorities());
            // SecurityContext에 인증 정보를 설정합니다.
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            // 필터 체인에서 다음 필터로 요청을 전달합니다.
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            // JWT 검증 중 오류가 발생하면 로그에 기록하고 클라이언트에 오류 메시지를 반환합니다.
            log.error("JWT Check Error..............");
            log.error(e.getMessage());
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // 요청 URI를 가져옵니다.
        String path = request.getRequestURI();

        log.info("check uri............." + path);

        if (request.getMethod().equals("OPTIONS")) // CORS preflight 요청은 필터를 적용하지 않음.
            return true;
        if (path.startsWith("/api/main/"))
            return true;


        // 아이디, 비밀번호 찾기

        if (path.startsWith("/api/member/findId"))
            return true;
        if (path.startsWith("/api/member/findPwd"))
            return true;

        // 이메일 전송
        if (path.startsWith("/api/member/verifyCodeAndFindId"))
            return true;
        if (path.startsWith("/api/member/verifyCodeAndFindPwd"))
            return true;


        // 회원가입
        if (path.startsWith("/api/member/join"))
            return true;
        if (path.startsWith("/api/member/emailCheck"))
            return true;
        if (path.startsWith("/api/member/nicknameCheck"))
            return true;
        if (path.startsWith("/api/member/pwdCheck"))
            return true;

        // 로그인
        if (path.startsWith("/api/member/loginlocal"))
            return true;

        // sns 로그인
        if (path.startsWith("/api/member/kakaoStart"))
            return true;
        if (path.startsWith("/api/member/kakaoLogin"))
            return true;
        if (path.startsWith("/api/member/naverStart"))
            return true;
        if (path.startsWith("/api/member/naverLogin"))
            return true;

        // 로그아웃
        if (path.startsWith("/api/member/logout"))
            return true;


        if (path.startsWith("/api/member/getMyProfileImg"))
            return true;
        if (path.startsWith("/api/member/fileupload"))
            return true;
        if (path.startsWith("/api/member/updateInfo"))
            return true;
        if (path.startsWith("/api/review/userReviews"))
            return true;
        if (path.startsWith("/api/member/checkEmail"))
            return true;


        // 이미지 관련
        if (path.startsWith("/api/images/"))
            return true;
        if (path.startsWith("/api/uploads/"))
            return true;
        if (path.startsWith("/api/favicon.ico"))
            return true;





        // 고객센터
        if (path.startsWith("/api/qna/qna"))
            return true;
        if (path.startsWith("/api/qna/writeQna"))
            return true;
        if (path.startsWith("/api/qna/getQnaView"))
            return true;
        if (path.startsWith("/api/qna/passCheck"))
            return true;

        if (path.startsWith("/api/notice/noticeList/"))
            return true;







        //course
        if (path.startsWith("/api/course/getTnames/"))
            return true;
        if (path.startsWith("/api/course/getMycourse/"))
            return true;

        if (path.startsWith("/api/course/getDuration/"))
            return true;

        if (path.startsWith("/api/rcommunity/suggestPlus"))
            return true;
        if (path.startsWith("/api/member/refresh/"))
            return true;
        if (path.startsWith("/api/review/reviewList/"))
            return true;
        if (path.startsWith("/api/review/writeReview"))
            return true;
        if (path.startsWith("/api/review/fileupload"))
            return true;
        if (path.startsWith("/api/review/reviewSearch"))
            return true;

        if (path.startsWith("/api/rcommunity/updatePicked"))
            return true;
        if (path.startsWith("/api/rcommunity/rCommunityUpdate"))
            return true;
        if (path.startsWith("/api/rcommunity/getPostList"))
            return true;
        if (path.startsWith("/api/rcommunity/writePost"))
            return true;
        if (path.startsWith("/api/rcommunity/rCommunityView"))
            return true;
        if (path.startsWith("/api/rcommunity/rCommunityDelete"))
            return true;
        if (path.startsWith("/api/rcommunity/getMyList"))
            return true;
        if (path.startsWith("/api/rcommunity/pick"))
            return true;

        //community
        if (path.startsWith("/api/rcrecommend/updateReplyPicked"))
            return true;
        if (path.startsWith("/api/rcrecommend/deleteReply"))
            return true;
        if (path.startsWith("/api/rcrecommend/fileup"))
            return true;
        if (path.startsWith("/api/rcrecommend/getReplies"))
            return true;
        if (path.startsWith("/api/rcrecommend/writeRecommend"))
            return true;

        //recommunity
        if (path.startsWith("/api/review/getReviewView/"))
            return true;
        if (path.startsWith("/api/review/reviewDelete/"))
            return true;
        if (path.startsWith("/api/review/updateReview/"))
            return true;
        if (path.startsWith("/api/reply/getReplies/"))
            return true;
        if (path.startsWith("/api/reply/addReply"))
            return true;
        if (path.startsWith("/api/reply/deleteReply/"))
            return true;




        //contents
        if (path.startsWith("/api/contents/contentsList/"))
            return true;
        if (path.startsWith("/api/contents/recentContentsList"))
            return true;
        if (path.startsWith("/api/contents/writeContents"))
            return true;

        if (path.startsWith("/api/contents/getContentsView/"))
            return true;

        if (path.startsWith("/api/contents/getContent/"))
            return true;
        if (path.startsWith("/api/contents/search"))
            return true;

        //timetable
        if (path.startsWith("/api/timetable/insertTimetable"))
            return true;
        if (path.startsWith("/api/timetable/deleteTimetable/"))
            return true;
        if (path.startsWith("/api/timetable/getTseq/"))
            return true;
        if (path.startsWith("/api/timetable/getAllMyCourse/"))
            return true;



        //dayschedule
        if (path.startsWith("/api/dayschedule/insertDayschedule"))
            return true;
        if (path.startsWith("/api/dayschedule/deleteDayschedule"))
            return true;

        return false;
    }


}