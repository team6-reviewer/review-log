import Error from "@/pages/error/Error";
import Home from "@/pages/home/Home";
import Join from "@/pages/join/Join";
import Login from "@/pages/login/Login";
import Mypage from "@/pages/mypage/Mypage";
import Withdraw from "@/pages/withdraw/Withdraw";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/join' element={<Join />} />
      </Routes>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/withdraw' element={<Withdraw />} />
      </Routes>
      <Route path='*' element={<Error />} />
    </>
  );
}

export default App;
