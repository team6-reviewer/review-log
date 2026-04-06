import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Error from "@/pages/Error";
import Home from "@/pages/Home";
import Join from "@/pages/Join";
import Login from "@/pages/Login";
import Mypage from "@/pages/Mypage";
import Withdraw from "@/pages/Withdraw";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        {/* 로그인 필요 없는 페이지 */}
        <Route path='/' element={<Login />} />
        <Route path='/join' element={<Join />} />

        {/* 로그인이 필요한 페이지 */}
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/mypage' element={<Mypage />} />
          <Route path='/withdraw' element={<Withdraw />} />
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
