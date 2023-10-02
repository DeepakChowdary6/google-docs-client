import TextEditor from "./TextEditor";
import './styles.css'
import {BrowserRouter as Router,Routes,
  Route,
} from "react-router-dom";
import Outlet from "./Outlet";


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" exact element={<Outlet/>}>

              </Route>
              <Route path="/documents/:id" element={<TextEditor/>}/>


          </Routes>
      </Router>
  );
}

export default App;
