/* eslint-disable max-lines */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-secrets/no-secrets */
'use client';

import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Repository setup on Windows Guide
      </Typography>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-1: Windows-ийн start aa нээгээд <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>Turn Windows features on or off</Typography> гэж хайгаад
          цонхоо нээнэ.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-1.png" width={900} height={400} style={{ objectFit: 'contain' }} alt="step-1" />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-2: Тухайн жагсаалтан дотроос <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>Windows Subsystems for Linux</Typography> ийг сонгоно.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-2.png" width={900} height={600} style={{ objectFit: 'contain' }} alt="step-1" />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-3: Command prompt оо <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>run as administartor</Typography> - оор нээнэ.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-3.png" width={900} height={600} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-4: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}> wsl --install</Typography> command -ийг бичин ажиллууллна.
        </Typography>
        <Typography>Энэ нь windows дээр linux subsystems ээр суулгаж байгаа юм.</Typography>
        <Stack my={2}>
          <Image src="/images/step-5.png" width={900} height={500} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-5: Амжилттай <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>wsl</Typography> ээ суулгалаа.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-6.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-6: Wsl-ээ амжилттай суулгаад, компьютероо restart хийнэ. Ингэснээр автоматаар доорх цонх гарч ирэн{' '}
          <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>Ubuntu</Typography> install хийгдэнэ.
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-7.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-7: Ubuntu install хийгдсэний дараа <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>username болон password</Typography> -оо оруулна.
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-8.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
        <Stack my={2}>
          <Image src="/images/step-9.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
        <Stack my={2}>
          <Image src="/images/step-10.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
        <Typography variant="h6" fontWeight="bold">
          Амжилттай ubuntu дээрээ user үүсгэлээ.
        </Typography>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-8: Доорх командыг ажиллуулан <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>SSH-KEY</Typography> үүсгэнэ.
        </Typography>

        <Typography variant="h6" fontWeight="bold">
          <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>ssh-keygen -t rsa -b 4096 -C "your_email@example.com"</Typography>
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-12.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-9: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>cd ~/.ssh</Typography> ашиглан ssh folder луу очино.
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-13.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-10: ssh folder луу очсоны дараа <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>cat id_rsa.pub</Typography> командыг ашиглан ssh-key ээ
          нээнэ.
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-14.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-11: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>ssh-key</Typography> ээ хуулж авна.
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-15.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-12: Хуулсан ssh-key ээ <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>github profile - SSH and GPG keys</Typography> гэсэн хэсэгт оруулна.
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ textDecoration: 'underline' }}>
          <Link href={'https://pinecone-intern-documentation.vercel.app/github-repository-setup/ssh-setup'} target="_blank">
            Хэрхэн оруулахыг эндээс үзэж болно.
          </Link>
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-16.png" width={900} height={500} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-13: Үүний дараа terminal дээрээ <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>cd ~</Typography> гэсэн командаар home folder дээрээ очсоны
          дараа repository -гоо clone хийнэ.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-17.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
        <Stack my={2}>
          <Image src="/images/step-18.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-14: Үүний дараа тухайн project ийн folder луу орон <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>code .</Typography> командыг ашиглан
          төслөө visual code дээр нээнэ.
        </Typography>

        <Typography variant="h6" fontSize={'16px'} mt={2}>
          Зурагт харуулсан modal гарч ирвэл allow хийнэ.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-19.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
        <Stack my={2}>
          <Image src="/images/step-20.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-15: Visual code дээрээ project оо нээсний дараа extension хэсэгт <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>WSL</Typography> ийг
          install хийнэ.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-21.png" width={900} height={500} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-16: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>WSL</Typography> ийг install хийсний дараа{' '}
          <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>Visual studio code</Typography> ийн зүүн доод булан дээрх цэнхэр button дээр даран{' '}
          <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>Connect to WSL</Typography> ийг сонгоно.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-22.png" width={800} height={200} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
        <Stack my={2}>
          <Image src="/images/step-23.png" width={800} height={300} className="object-contain" alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-17: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>Connect to WSL</Typography> ийг сонгосоны дараа төслийн folder оо нээнэ.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-25.png" width={900} height={500} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-18: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>sudo apt-get install curl</Typography> командыг ажиллуулан{' '}
          <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}> linux package management tool </Typography>
          суулгана.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-26.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-19: Дээрх командыг суулгасаны дараа{' '}
          <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash</Typography>{' '}
          командыг ашиглан <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>node version manager</Typography> суулгана.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-27.png" width={900} height={500} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
        <Stack my={2}>
          <Image src="/images/step-28.png" width={900} height={500} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-20: Node version manager суулгасны дараа зурагт харуулж байгаа хэсгийг хуулан ажиллуулна.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-30.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-21: Ингэснээр node version manager ээ амжилттай суулгалаа.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-31.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-22: Node version manager ээ ашиглан <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}> nvm install 18 </Typography> node суулгана.
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-32.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-23: Node оо суулгасны дараа <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>yarn</Typography> cуулгана.
        </Typography>

        <Typography variant="h6" fontWeight="bold">
          Комманд: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>npm install --global yarn</Typography>
        </Typography>
        <Stack my={2}>
          <Image src="/images/step-33.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-24: <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}> Yarn</Typography> ашиглан{' '}
          <Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>node_modules</Typography> суулгана.
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-34.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Stack my={2}>
        <Typography variant="h6" fontWeight="bold">
          Step-25:<Typography sx={{ display: 'inline', color: '#4ade80', fontWeight: '700', fontSize: '24px' }}>node_modules</Typography> ээ суулгасаны дараа documentation project асаая.
        </Typography>

        <Stack my={2}>
          <Image src="/images/step-35.png" width={900} height={400} alt="step-1" style={{ objectFit: 'contain' }} />
        </Stack>
      </Stack>

      <Typography variant="h6" fontWeight="bold" mt={3}>
        Ийнхүү windows дээр ubuntu суулган repository амжилттай clone хийлээ.
      </Typography>
    </Stack>
  );
};

export default Page;
