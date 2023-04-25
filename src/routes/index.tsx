import './index.css'
import { Header } from '~/components/Header'
import DataBrokerList from '~/components/databrokers/DataBrokersList'
import { Divider } from '~/components/Divider'
import SignUpWrapper from '~/components/signUpFlow/signUpWrapper'

export default function Home() {
  return (
    <>
      <Header />
      <main class="mb-20">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl mb-4 text-center">Data Broker Remover Tool</h2>
          <p>
            This tool generates and sends emails to Data Brokers in order to get
            them to remove you from their databases{' '}
          </p>
          <p>It's provided without any guarantees or support</p>
          <p>We don't store any readable information, only a hashed version of your email to prevent spamming the data brokers </p>
          <p class='mt-5'>A data broker crawls the internet for information as well as buying it from companies whose services you use, the broker then bundles it up and uses it or sells it on to 3rd parties. The third parties can then use the information collected how they like.</p>
          <br/>
          <p>See the source code <a target="_blank" class="font-bold" href="https://github.com/visible-cx/databroker_remover">here</a>. The privacy policy for this tool can be found <a class="font-bold" href="/privacy" target="_blank">here </a>  </p>
          <br/>
          <p>If you'd like to know more about the people who built this, and what we do most of the time you can find more about us <a href="https://www.visible.cx/join" target="_blank" class="font-bold">here</a></p>
        </div>
        <Divider verticalPadding={`my-12`} />
        <SignUpWrapper />
        <Divider verticalPadding={`my-12`} />
        <div class="container mx-auto px-4">
          <h2 class="text-xl font-bold mb-4">How it works</h2>
          <ul>
            <li>1. Enter your email address</li>
            <li>2. We'll send you a verification code</li>
            <li>
              3. Once you confirm the code, you can input your name & address to
              generate the email to send to the broker. We do not store your name or address, it is only used to generate the email.
            </li>
            <li>4. We send the emails out. You will be CC'd on them so you can see them, you don't need to take any action.</li>
            <li>
              5. Only your email address is stored once it has been hashed (SHA256), and is deleted after 45
              days. This is to ensure you don't send out multiple emails within a short period of time. You're free to repeat the process after 45 days.
            </li>
          </ul>
        </div>
        <Divider verticalPadding={`my-12`} />
        <DataBrokerList />
      </main>
    </>
  )
}
