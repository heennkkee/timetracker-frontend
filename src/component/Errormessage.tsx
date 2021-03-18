export type Error = {
    message: string
    title: string
}

type ErrormessageProps = {
    error: Error
}

const Errormessage = ({error}: ErrormessageProps) => {
    return (
        <p className="lead">
            <span className="bold text-danger">{error.title}: </span>
            {error.message}
        </p>
    )
}

export default Errormessage;