import React from 'react'

const ForumSubjectContent = (props) => {
    //On click show a reply box that will have save & clear buttons
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{props.body}</p>
    </div>
  )
}

export default ForumSubjectContent
