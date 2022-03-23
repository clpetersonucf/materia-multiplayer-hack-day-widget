import React, { useState, useEffect } from 'react'

const QuestionReview = (props) => {

	return (
		<div className={`question-review ${props.show ? 'show': ''}`}>
				Time to review how you did!
				{
					props.timeline.map(player => <div className='timeline-response' key={player.player}>Player: {player.player} Value: {player.value}</div>)
				}
			</div>
	)
}

export default QuestionReview