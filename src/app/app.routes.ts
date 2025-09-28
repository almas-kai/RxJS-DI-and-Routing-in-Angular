import { Routes } from '@angular/router';
import { ToDosComponent } from './components/to-dos/to-dos';
import { HomePage } from './components/home-page/home-page';
import { ToDosService } from './services/to-dos.service';
import { RandomTodo } from './components/random-todo/random-todo';
import { Counter } from './components/counter/counter';
import { authenticationGuard } from './guards/authentication-guard';

export const routes: Routes = [
	{
		path: '',
		component: HomePage,
		title: 'Home Page'
	},
	{
		path: 'to-dos',
		component: ToDosComponent,
		title: 'To Dos',
		providers: [
			ToDosService
		],
		children: [
			{
				path: 'random-to-do/:id',
				component: RandomTodo
			}
		],
		data: {
			tokenKey: 'todos-token'
		},
		canActivate: [authenticationGuard]
	},
	{
		path: 'counter',
		component: Counter,
		title: 'My counter',
		data: {
			tokenKey: 'counter-token'
		},
		canActivate: [authenticationGuard]
	}
];
