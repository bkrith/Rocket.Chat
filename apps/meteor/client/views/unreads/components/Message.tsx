/* eslint-disable complexity */
import type { IMessage } from '@rocket.chat/core-typings';
// import { Message as MessageTemplate, MessageLeftContainer, MessageContainer, MessageBody, CheckBox } from '@rocket.chat/fuselage';
// import { Message as MessageTemplate,  MessageContainer, MessageBody } from '@rocket.chat/fuselage';
import { Message as MessageContainer } from '@rocket.chat/fuselage';
// import { useToggle } from '@rocket.chat/fuselage-hooks';
import React, { FC, memo } from 'react';

// import UserAvatar from '../../../components/avatar/UserAvatar';
// import { useIsMessageHighlight } from '../../room/MessageList/contexts/MessageHighlightContext';
import {
	// useIsSelecting,
	// useToggleSelect,
	// useIsSelectedMessage,
	useCountSelected,
} from '../../room/MessageList/contexts/SelectedMessagesContext';
import { MessageWithMdEnforced } from '../../room/MessageList/lib/parseMessageTextToAstMarkdown';
// import { useMessageActions } from '../../room/contexts/MessageContext';
// import MessageContentIgnored from './MessageContentIgnored';
import MessageContent from './MessageContent';
// import MessageHeader from './MessageHeader';
// import { MessageIndicators } from './MessageIndicators';
// import Toolbox from './Toolbox';

const Message: FC<{
	message: MessageWithMdEnforced;
	sequential: boolean;
	id: IMessage['_id'];
	unread: boolean;
	mention: boolean;
	all: boolean;
	// }> = ({ message, sequential, all, mention, unread, ...props }) => {
}> = ({ message }) => {
	// }> = ({ message }) => {
	// const isMessageHighlight = useIsMessageHighlight(message._id);
	// const [isMessageIgnored, toggleMessageIgnored] = useToggle((message as { ignored?: boolean }).ignored ?? false);
	// const {
	// 	actions: { openUserCard },
	// } = useMessageActions();

	// const isSelecting = useIsSelecting();
	// const toggleSelected = useToggleSelect(message._id);
	// const isSelected = useIsSelectedMessage(message._id);
	useCountSelected();

	return (
		<>
			{/* <MessageTemplate
			{...props}
			onClick={isSelecting ? toggleSelected : undefined}
			isSelected={isSelected}
			isEditing={isMessageHighlight}
			isPending={message.temp}
			sequential={sequential}
			data-qa-editing={isMessageHighlight}
			data-qa-selected={isSelected}
		> */}
			{/* <MessageLeftContainer>
				{!sequential && message.u.username && !isSelecting && (
					<UserAvatar
						url={message.avatar}
						username={message.u.username}
						size={'x36'}
						onClick={openUserCard(message.u.username)}
						style={{ cursor: 'pointer' }}
					/>
				)}
				{isSelecting && <CheckBox checked={isSelected} onChange={toggleSelected} />}
				{sequential && <MessageIndicators message={message} />}
			</MessageLeftContainer> */}

			<MessageContainer>
				{/* {!sequential && <MessageHeader message={message} />} */}

				<MessageContent message={message} />
				{/* {!isMessageIgnored && (
					<MessageContent id={message._id} message={message} unread={unread} mention={mention} all={all} sequential={sequential} />
				)} */}
				{/* {isMessageIgnored && (
					<MessageBody data-qa-type='message-body'>
						<MessageContentIgnored onShowMessageIgnored={toggleMessageIgnored} />
					</MessageBody>
				)} */}
			</MessageContainer>
			{/* {!message.private && <Toolbox message={message} />} */}
			{/* </MessageTemplate> */}
		</>
	);
};

export default memo(Message);
