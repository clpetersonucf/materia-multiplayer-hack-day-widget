import React, { useState } from 'react'

const PlayerStatus = (props) => {


	return (
		<section className={`player-status ${props.gameStatus != 'pending' && props.gameStatus != 'new-game' && props.gameStatus != 'existing-game' ? 'show' : ''}`}>
			{ props.clients > 1 ?
				<span>{props.playersReady} of {props.clients} report ready.</span>
			:
				<span>You are playing in solo mode.</span>
			}
		</section>
	)
}

export default PlayerStatus