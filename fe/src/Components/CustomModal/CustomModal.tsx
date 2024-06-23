import {useDisclosure} from '@mantine/hooks';
import {Modal, Button} from '@mantine/core';
import {ReactNode} from "react";

export default function CustomModal({children, title, close, opened}: {
    children: ReactNode,
    title: string,
    close: () => void,
    opened: boolean
}) {

    return (
        <Modal opened={opened} onClose={close} title={title}>
            {children}
        </Modal>
    );
}