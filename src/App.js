import { Switch, Route, Redirect } from 'react-router-dom';

import './App.scss';
import './style/base.css'
import './style/normalize.css'

import Home from './pages/home/Home.jsx'
import _404 from './pages/404/_404.jsx'

function App() {
	return (
		<div className="App">
			<Switch>
				<Route path="/home" component={Home}></Route>
				<Route path="/" exact render={
					()=> (
						<Redirect to="/home"/>)}>
				</Route>
				<Route path="*" component={_404}></Route>
			</Switch>
		</div>
	);
}

export default App
