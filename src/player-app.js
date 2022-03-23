import React, {useState, useMemo, useEffect} from 'react'

import GameWindow from './game-window'
// import WebSocket from 'ws'

const PlayerApp = (props) => {

	const playerId = useMemo(() => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9), [])
	const sessionId = useMemo(() => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5), [])

	const [state, setState] = useState({
		initialized: false,
		socket: null,
		playerId: playerId,
		sessionId: sessionId,
		connectionStatus: 'pending',
		gameStatus: 'pending',
		clientStatus: 0,
		questionIndex: -1,
		currentQuestionQueue: 0,
		timeline: []
	})

	useEffect(() => {

		if (state.initialized == false) {

			if (!state.socket) {
				var socket = new WebSocket('ws://localhost:8228')

				socket.onopen = () => {
					console.log('connection established')
					setState(state => ({...state, socket: socket, connectionStatus: 'connected' }))
				}

				socket.onmessage = (event) => {

					if (event.data) {
						let receipt = JSON.parse(event.data)
						if (receipt.notice) console.log(receipt.notice)
						else if (receipt.message) {
							switch (receipt.message) {
								case 'game-status':
	
									console.log(receipt.payload)
	
									switch (receipt.payload.status) {
										case 'new-game':
											console.log('initializing new game')
											setState(state => ({...state, gameStatus: 'new-game', clientStatus: 1}))
											break;
										case 'existing-game':
											console.log('initializing existing game')
											setState(state => ({...state, gameStatus: 'existing-game', clientStatus: receipt.payload.clients}))
											break;
										case 'waiting':
											console.log('server is waiting for another player')
											console.log('num ready: ' + receipt.payload.numReady + ' out of ' + state.clientStatus)
											setState(state => ({...state, gameStatus: 'waiting'}))
											break;
										case 'ready':
											console.log('all players report ready')
											setState(state => ({...state, questionIndex: state.questionIndex + 1, gameStatus: 'in-progress'}))
											break;
										case 'waiting-for-remaining-players':
											console.log('game status is waiting for next question')
											break;
										case 'ready-for-next-question':
											console.log('game status is ready for next question')
											setState(state => ({...state, gameStatus: 'question-review', timeline: receipt.payload.timeline}))
											break;
										default:
											return false
									}
									break;
								case 'client-status':
									
									switch (receipt.payload.status) {
										case 'client-count':
											setState(state => ({...state, clientStatus: receipt.payload.data}))
											break;
										default:
											return false
									}
									break;
								
								default:
									console.log('receipt message not registered : ' + receipt.message)
							}
						}
					}
				}

				socket.onerror = (event) => {
					console.log('socket connection error')
					setState(state => ({...state, connectionStatus: 'error'}))
				}
			}

			setState(state => ({...state, initialized: true}))
		}
	
	}, [state.initialized])

	useEffect(() => {
		console.log('state session id updated to ' + state.sessionId)
	}, [state.sessionId])

	const getReadyState = (value) => {
		switch (value) {
			case 0:
				return 'connecting'
			case 1:
				return 'connected'
			case 2:
				return 'closed'
			case 3:
				return 'closed'
			default:
				return 'unknown'
		}
	}

	const onSessionIdChange = (event) => {
		event.persist()
		setState(state => ({...state, sessionId: event.target.value}))
	}

	const handleConnect = (event) => {
		state.socket.send(JSON.stringify({ session: state.sessionId, action: 'session-connect', payload: { playerId: state.playerId }}))
	}

	const handleSendSocketMessage = (message) => {
		console.log('socket status: ' + getReadyState(state.socket.readyState))
		state.socket.send(JSON.stringify({ ...message, session: state.sessionId, playerId: state.playerId }))
	}

	const handleQuestionUpdate = (response) => {
		console.log('response logged: ' + response)
		setState(state => ({...state, gameStatus: 'waiting-for-next-question'}))
		state.socket.send(JSON.stringify({
			session: state.sessionId,
			playerId: state.playerId,
			action: 'player-question-answered',
			payload: {
				questionIndex: state.questionIndex,
				status: 'ready',
				context: 'next-question',
				answerId: response
			}
		}))
	}

	return (
		<div className='player-app'>
			<h2>Materia Multiplayer Widget</h2>

			<section className='session'>
				Enter a session ID: <input className='connection' type='text' value={state.sessionId} onChange={onSessionIdChange} />
				<span>
					By default, a random session ID is generated for you.
				</span>
				<button className='connect' onClick={handleConnect}>Connect</button>
			</section>
			<div className={`connection-status ${state.connectionStatus}`}>{state.connectionStatus}</div>
			<div className='player-status'>Your player ID: {state.playerId}</div>
			<GameWindow
				sendSocketMessage={handleSendSocketMessage}
				status={state.gameStatus}
				clients={state.clientStatus}
				question={props.qset.items[state.questionIndex]}
				questionIndex={state.questionIndex}
				onQuestionUpdate={handleQuestionUpdate}
				currentQuestionQueue={state.questionPlayerQueue}
				timeline={state.timeline}
				qset={props.qset}></GameWindow>
		</div>
	)
}

export default PlayerApp