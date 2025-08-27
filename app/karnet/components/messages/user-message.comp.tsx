"use client";

type UserMessageProps = {
	content: string;
};

export const UserMessage = ({ content }: UserMessageProps) => {
	return (
		<div className="flex justify-end">
			<div className="bg-primary max-w-md rounded-lg p-4 text-white">
				{content}
			</div>
		</div>
	);
};
