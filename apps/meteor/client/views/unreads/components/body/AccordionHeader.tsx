import { Button, ButtonGroup, Icon } from '@rocket.chat/fuselage';
import { Header } from '@rocket.chat/ui-client';
import React, { FC } from 'react';

import MarkdownText from '../../../../components/MarkdownText';
import RoomAvatar from '../../../../components/avatar/RoomAvatar';
import { useRoomIcon } from '../../../../hooks/useRoomIcon';

<<<<<<< HEAD
const AccordionHeader: FC<{ room: any }> = ({ room }) => {
=======
const AccordionHeader: FC<{ room: any; handleMark: any }> = ({ room, handleMark }) => {
	const t = useTranslation();
>>>>>>> e749960721 (improve loading, fix bugs and add mark as read)
	const icon = useRoomIcon(room);

	const threadsText = room.threads.length === 1 ? ` and ${room.threads.length} thread` : ` and ${room.threads.length} threads`;

	return (
		<Header borderBlockStyle='unset'>
			<Header.Avatar>
				<RoomAvatar room={room} />
			</Header.Avatar>
			<Header.Content>
				<Header.Content.Row>
					<Header.Icon icon={icon} />
					<Header.Title is='h1'>{room.name}</Header.Title>
				</Header.Content.Row>
				<Header.Content.Row>
					<Header.Subtitle is='h2'>
						<MarkdownText
							parseEmoji={true}
							variant='inlineWithoutBreaks'
							withTruncatedText
<<<<<<< HEAD
							content={`Total ${room.messages.length} unread messages ${room.threads.length > 0 ? threadsText : ''}`}
=======
							content={t('Total_unreads').replace('{messages}', room?.unread + (room?.tunread?.length || 0))}
>>>>>>> e749960721 (improve loading, fix bugs and add mark as read)
						/>
					</Header.Subtitle>
				</Header.Content.Row>
			</Header.Content>
			<ButtonGroup>
				<Button onClick={handleMark}>
					<Icon name={'flag'} size='x20' margin='4x' />
					<span style={{ marginLeft: '10px' }}>{t('Mark_as_read')}</span>
				</Button>
			</ButtonGroup>
		</Header>
	);
};

export default AccordionHeader;
