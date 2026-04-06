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
        <Route path='/' element={<Login />} />
        <Route path='/join' element={<Join />} />

        <Route path='/home' element={<Home />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/withdraw' element={<Withdraw />} />

        <Route path='*' element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
