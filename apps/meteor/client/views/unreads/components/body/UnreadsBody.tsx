import { Accordion, Box, Button, ButtonGroup, Icon } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React, { FC, memo } from 'react';

import AccordionHeader from '../headers/AccordionHeader';
import MessageList from '../messages/MessageList';

type UnreadsBodyProps = {
	sortedRooms: any;
	expandedItem: any;
	activeMessages: any;
	handleMarkAll: () => Promise<void>;
	handleMark: (id: string) => Promise<void>;
	getMessages: (room: any) => Promise<void>;
};

const UnreadsBody: FC<UnreadsBodyProps> = ({ sortedRooms, handleMark, expandedItem, activeMessages, getMessages }) => {
	const t = useTranslation();
	return (
		<Box marginBlock='none' paddingBlock='none' marginInline='auto' width='full'>
			<Accordion borderBlockStyle='unset'>
				{sortedRooms?.map((room: any) => (
					<Accordion.Item
						key={room._id}
						className='unreadsAccordionHeader'
						title={<AccordionHeader room={room} />}
						expanded={expandedItem === room._id}
						onToggle={(): void => {
							getMessages(room);
						}}
					>
						<ButtonGroup flexDirection='row' justifyContent={'flex-end'} padding={0} paddingBlockEnd={20}>
							<Button onClick={(): Promise<void> => handleMark(room.rid)}>
								<Icon name={'flag'} size='x20' margin='4x' />
								<span style={{ marginLeft: '10px' }}>{t('Mark_read')}</span>
							</Button>
						</ButtonGroup>
						<MessageList messages={activeMessages} rid={room.rid} />
					</Accordion.Item>
				))}
			</Accordion>
		</Box>
	);
};
export default memo(UnreadsBody);
