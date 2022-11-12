import { Button, ButtonGroup, Icon, Avatar } from '@rocket.chat/fuselage';
import { Header } from '@rocket.chat/ui-client';
import { useTranslation, useRoute } from '@rocket.chat/ui-contexts';
import React, { FC } from 'react';

import MarkdownText from '../../../../components/MarkdownText';
import { useRoomIcon } from '../../../../hooks/useRoomIcon';

const AccordionHeader: FC<{ room: any }> = ({ room }) => {
	const t = useTranslation();

	const icon = useRoomIcon(room);
	const groupRoute = useRoute('/group/:name/:tab?/:context?');
	const channelRoute = useRoute('/channel/:name/:tab?/:context?');
	const directRoute = useRoute('/direct/:name/:tab?/:context?');

	return (
		<Header borderBlockStyle='unset'>
			<Header.Avatar>
				{room.t === 'c' && <Avatar url={`/avatar/${room.name}`} />}
				{room.t === 'p' && <Avatar url={`/avatar/room/${room.rid}`} />}
				{room.t === 'd' && <Avatar url={`/avatar/${room.name}`} />}
			</Header.Avatar>
			<Header.Content>
				<Header.Content.Row style={{ flexDirection: 'row' }}>
					<Header.Icon icon={icon} />
					<Header.Title is='h1'>{room.name}</Header.Title>
					<ButtonGroup style={{ marginLeft: 'auto' }}>
						<Button
							id={room._id}
							onClick={(): void => {
								if (room.t === 'c') {
									channelRoute.push({ name: room.rid });
								} else if (room.t === 'd') {
									directRoute.push({ name: room.rid });
								} else {
									groupRoute.push({ name: room.rid });
								}
							}}
						>
							<Icon name={'add-reaction'} size='x20' margin='4x' />
							<span style={{ marginLeft: '10px' }}>{'Go to room'}</span>
						</Button>
					</ButtonGroup>
				</Header.Content.Row>
				<Header.Content.Row>
					<Header.Subtitle is='h3'>
						<MarkdownText
							parseEmoji={true}
							variant='inlineWithoutBreaks'
							withTruncatedText
							content={t('Total_unreads').replace('{messages}', room?.messages?.length)}
						/>
					</Header.Subtitle>
				</Header.Content.Row>
			</Header.Content>
		</Header>
	);
};

export default AccordionHeader;
