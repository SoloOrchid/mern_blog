import Link from 'next/link'
import CustomAppShell from "../Layout/CustomAppShell";

export default function NotFound() {
    return (
        <CustomAppShell>
            <h2>Happy mistake: 404</h2>
            <p>Oh no! Could not find what you're looking for</p>
            <Link href="/" style={{
                textDecoration: 'underline'
            }}>
                Return Home {'>'}
            </Link>
        </CustomAppShell>
    )
}