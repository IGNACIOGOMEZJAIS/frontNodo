import AppRouter from './routes/AppRouter'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import { FilmProvider } from './context/FilmContext'

function App() {

  return (
    <>
    <AuthProvider>
      <FilmProvider>
      <AppRouter />
      <ToastContainer />
      </FilmProvider>
    </AuthProvider>
    </>
  )
}

export default App
