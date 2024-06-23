import CustomAppShell from "../Layout/CustomAppShell";
import {AspectRatio, Image, Overlay} from "@mantine/core";

export default function HomePage() {
    return (
        <CustomAppShell>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '2rem',
                gap: '1rem',
            }}>
                <div style={{textAlign: 'center'}}>
                        <h1>Welcome to MediumEcho</h1>
                        <h3>Discover, Share, and Connect Through Stories</h3>
                        <p>At MediumEcho, we believe that everyone has a story to tell. Our platform provides a
                            space
                            where writers, readers, and thinkers can come together to share ideas, experiences, and
                            knowledge.
                            Whether you are a seasoned writer or just getting started, our community is here to support
                            and
                            inspire you.</p>
                </div>

                <div>
                    <h1>What is MediumEcho?</h1>
                    <p>MediumEcho is a user-friendly platform designed for publishing, reading, and discussing
                        articles on a wide range of topics. Our mission is to empower individuals to share their voices
                        and connect with others through the power of written words. Here, you can:</p>
                    <ol>
                        <li>Write and Publish: Create and share your articles with a supportive and engaged audience.
                        </li>
                        <li>Read and Explore: Discover diverse content from writers around the world.</li>
                        <li>Engage and Connect: Comment, discuss, and connect with writers and readers who share your
                            interests.
                        </li>
                    </ol>
                </div>

                <div>
                    <h1>Why We Created MediumEcho</h1>
                    <p>In a world where information is abundant but genuine connection can be scarce, we wanted to
                        create a
                        space that values thoughtful content and meaningful interactions. MediumEcho was
                        founded on
                        the belief that:</p>
                    <ol>
                        <li>Everyone’s Voice Matters: We believe that everyone has a unique perspective that deserves to
                            be heard.
                        </li>
                        <li>Community is Key: By bringing people together through stories, we can foster understanding
                            and connection.
                        </li>
                        <li>Quality Over Quantity: We prioritize quality content that adds value to our readers'
                            lives.
                        </li>
                    </ol>
                </div>

                <div>
                    <h1>Join Our Community</h1>
                    <h3>We invite you to join our growing community of writers and readers. Whether you want to share
                        your
                        thoughts, find inspiration, or engage in insightful discussions, MediumEcho is the
                        place
                        for you.</h3>
                    <ol>
                        <li>Sign Up Today: Create your account and start sharing your stories.</li>
                        <li>Subscribe: Stay updated with the latest articles and newsletters.</li>
                        <li>Follow Us: Connect with us on social media for updates, tips, and community highlights.</li>
                    </ol>
                </div>
            </div>
        </CustomAppShell>
    );
}
