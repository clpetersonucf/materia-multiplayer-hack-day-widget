import React, { useState, useEffect } from 'react'
import QuestionReview from './question-review'

const GameWindow = (props) => {

	const [state, setState] = useState({selected: null, questionState: 'pre-response'})

	const answerSelect = (id) => {
		console.log('you selected ' + id)
		setState({...state, selected: id})
	}

	const submitSelection = (event) => {
		props.onQuestionUpdate(state.selected)
		setState({...state, questionState: 'post-response'})
	}

	const readyCheckReport = (report) => {
		props.sendSocketMessage({  action: 'ready-check-report', payload: { status: report, context: 'pre-start' }})
	}

	const answers = props.question?.answers.map((answer) => {
		return <div className='answer' key={answer.id}>
			<input type='radio' name={props.question.id} value={answer.id} onClick={() => answerSelect(answer.id)} disabled={props.status == 'waiting-for-next-question' ? true : false}/><label>{answer.text}</label>
		</div>
	})

	return (
		<section className='game-window'>
			<QuestionReview
				qset={props.qset}
				timeline={props.timeline}
				show={props.status == 'question-review'}></QuestionReview>
			<div className={`ready-check ${props.status == 'new-game' || props.status == 'existing-game' || props.status == 'waiting' ? 'show' : ''}`}>
				The game is currently waiting for other players. If you're ready, feel free to hit Start. If you want to wait for more players, hit Wait.

				<button className='ready-check-response' value='start' onClick={() => readyCheckReport('ready')}>Start</button>
				<button className='ready-check-response' value='wait'  onClick={() => readyCheckReport('wait')}>Wait for Other Players </button>
			</div>
			<div className={`game-status ${props.status}`}>
				The game status is {props.status}.
			</div>
			<span className={`client-count ${props.clients > 0 ? 'show': ''}`}>Players: {props.clients}</span>
			<div className={`game-content ${props.status == 'in-progress' || props.status == 'waiting-for-next-question' ? 'show': ''}`}>
				<span className='question'>{props.question?.questions[0].text}</span>
				<div className='answers'>
					{answers}
				</div>
				{ state.questionState == 'pre-response' ?
					<button className='submitChoice' onClick={submitSelection} disabled={props.status == 'waiting-for-next-question' ? true : false}>Submit My Answer!</button>
				:
					<span className='wait-for-it'>You've submitted your answer! Wait for the other players to finish.</span>
				}
			</div>
		   
		</section>
	)
}

export default GameWindow