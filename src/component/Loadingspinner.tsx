type LoadingSpinnerProps = {
    themeInverse: string
}
const Loadingspinner = ({ themeInverse }: LoadingSpinnerProps) => {
    return (
        <div className="d-flex justify-content-center">
            <div className={`spinner-border text-${themeInverse}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Loadingspinner;