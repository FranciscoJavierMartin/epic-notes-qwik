interface HoneypotInputProps {
	fieldName: string;
}

export default function HoneypotInput({ fieldName }: HoneypotInputProps) {
	return (
		<div class='hidden' aria-hidden>
			<label for={`${fieldName}-input`}>Please leave this field blank</label>
			<input id={`${fieldName}-input`} name={fieldName} type='text' />
		</div>
	);
}
