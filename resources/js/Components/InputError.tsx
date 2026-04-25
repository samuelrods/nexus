export default function InputError({ message, className = "", ...props }: any) {
    return message ? (
        <p
            {...props}
            data-testid="input-error"
            className={"text-sm text-red-600 dark:text-red-400 " + className}
        >
            {message}
        </p>
    ) : null;
}
