import { BrowserRouter , Route, Routes } from "react-router"
import MainLayout from "./components/layout/MainLayout"

function App() {
 
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* MainLayout */}
          <Route element={<MainLayout />}>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
