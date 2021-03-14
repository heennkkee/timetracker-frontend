type ErrormessageProps = {
    message: string
}

const Errormessage = ({ message }: ErrormessageProps) => {
    return (
        <p className="lead">
            <span className="bold text-danger">Error: </span>
            {message}
        </p>
    )
}

export default Errormessage;