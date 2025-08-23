import './App.css'
import { Button, DatePicker } from 'antd'

function App() {

  return (
    <>
         <div style={{ padding: 20 }}>
      <h1>React + Vite + Ant Design</h1>
      <Button type="primary">Nút AntD</Button>
      <br /><br />
      <DatePicker />
    </div>
    </>
  )
}

export default App
