const Course = ( { course } ) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
      </div>
    )
  }
  
  const Header = ( { course } ) => <div> <h2> {course} </h2> </div>
  
  const Content = ( { parts } ) => {
    return (
      <div>
  
        {parts.map(part =>
          <p key={part.id}> {part.name} {part.exercises} </p> )}
  
        <Total parts={parts} />
      </div>
    )
  }
  
  const Total = ( { parts } ) => {
  
    const total = parts.reduce((s, p) => s + p.exercises, 0)
  
    return (
      <div>
        <b> total of exercises {total} </b>
      </div>
    )
  }

  export default Course