import Link from "next/link";
import {Button} from "@mantine/core";
import CustomModal from "@/Components/CustomModal/CustomModal";
import {useDisclosure} from "@mantine/hooks";

export default function RegisterModal({ opened, open, close }: {opened: boolean, open: () => void, close: () => void}) {
    // const [opened, {open, close}] = useDisclosure(false);

    return (
        <CustomModal title={``} close={close} opened={opened}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                alignItems: 'center'
            }}>
                <h4 style={{lineHeight: 0}}>You need an account to interact with posts</h4>
                <div><p>having an account on MediumEcho will allow you to</p>
                    <ol>
                        <li>Create your own articles</li>
                        <li>Save articles to read again</li>
                        <li>comment on articles</li>
                    </ol>
                </div>
                <div style={{
                    display: 'flex', flexFlow: 'row', gap: '0.3rem'
                }}>
                    <Link href={"/register"}><Button>Sign Up</Button></Link>
                </div>
            </div>
        </CustomModal>
    )
}