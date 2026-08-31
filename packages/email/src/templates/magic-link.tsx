import type { CSSProperties } from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email'

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: '#f5f5f5',
    color: '#171717',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: '32px 12px',
  },
  button: {
    backgroundColor: '#171717',
    borderRadius: '8px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: 600,
    padding: '12px 18px',
    textDecoration: 'none',
  },
  buttonSection: {
    margin: '24px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    margin: '0 auto',
    maxWidth: '520px',
    padding: '32px',
  },
  divider: {
    borderColor: '#e5e5e5',
    margin: '28px 0 20px',
  },
  footer: {
    color: '#666666',
    fontSize: '13px',
    lineHeight: '20px',
    margin: 0,
  },
  heading: {
    fontSize: '22px',
    lineHeight: '30px',
    margin: '0 0 16px',
  },
  helpText: {
    color: '#666666',
    fontSize: '13px',
    lineHeight: '20px',
    margin: '0 0 8px',
  },
  link: {
    color: '#2563eb',
    fontSize: '13px',
    lineHeight: '20px',
    wordBreak: 'break-all',
  },
  text: {
    fontSize: '15px',
    lineHeight: '24px',
    margin: 0,
  },
}

export interface MagicLinkEmailProps {
  appName: string
  magicLinkUrl: string
}

export function MagicLinkEmail({
  appName,
  magicLinkUrl,
}: MagicLinkEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`Sign in securely to ${appName}`}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>{`Sign in to ${appName}`}</Heading>
          <Text style={styles.text}>
            Use the button below to securely sign in to your account.
          </Text>
          <Section style={styles.buttonSection}>
            <Button href={magicLinkUrl} style={styles.button}>
              Sign in
            </Button>
          </Section>
          <Text style={styles.helpText}>
            If the button does not work, copy and paste this link into your browser:
          </Text>
          <Link href={magicLinkUrl} style={styles.link}>
            {magicLinkUrl}
          </Link>
          <Hr style={styles.divider} />
          <Text style={styles.footer}>
            This link expires in 10 minutes and can only be used once. If you did
            not request it, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

MagicLinkEmail.PreviewProps = {
  appName: 'Probe',
  magicLinkUrl: 'http://localhost:3001/api/auth/magic-link/verify?token=preview-token',
} satisfies MagicLinkEmailProps

export default MagicLinkEmail
