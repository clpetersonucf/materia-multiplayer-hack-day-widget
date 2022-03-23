import React from 'react'
import ReactDOM from 'react-dom'
import PlayerApp from './player-app'

Materia.Engine.start({
	start: (instance, qset) => {
		ReactDOM.render(
			<PlayerApp qset={qset} />, document.getElementById('root')
		)
	}
})