'use client';

import {
  Drawer as MuiDrawer,
  Toolbar,
  List,
  Divider,
  Stack,
  ListItemButton,
  Typography,
  Collapse,
} from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { DRAWER_WIDTH, SECTIONS, Section } from '../libs/constants';
import { useState } from 'react';

import { ExpandMore, KeyboardArrowRight } from '@mui/icons-material';
import Link from 'next/link';

export const Drawer = () => {
  return (
    <MuiDrawer
      variant="permanent"
      anchor="left"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
        },
      }}
    >
      <Toolbar sx={{ p: 2 }}>
        <Stack position="relative" height="100%" width="100%">
          <Image
            style={{ objectFit: 'contain', objectPosition: 'left' }}
            src="/logo.png"
            alt="pinecone logo"
            fill
          />
        </Stack>
      </Toolbar>

      <Divider />

      <List sx={{ p: 2 }}>
        {SECTIONS.map((item) => (
          <Item key={item.title} {...item} />
        ))}
      </List>
    </MuiDrawer>
  );
};

const Item = ({ title, items }: Section) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ p: 0.5, borderRadius: 1 }}>
        <Stack direction="row" alignItems="center" color="primary.light">
          {isOpen ? (
            <ExpandMore fontSize="small" color="inherit" />
          ) : (
            <KeyboardArrowRight fontSize="small" color="inherit" />
          )}

          <Typography
            pl={1}
            color="common.white"
            fontSize={14}
            fontWeight="600"
          >
            {title}
          </Typography>
        </Stack>
      </ListItemButton>

      <Collapse
        in={isOpen}
        timeout="auto"
        unmountOnExit
        sx={{ position: 'relative' }}
      >
        <List disablePadding>
          {items.map((item) => {
            const isActive = item.path === pathname;

            return (
              <Link key={item.title} href={item.path}>
                <ListItemButton
                  sx={{ p: 0.5, borderRadius: 1, position: 'relative' }}
                >
                  <Typography
                    pl={6}
                    fontSize={14}
                    fontWeight="600"
                    color={isActive ? 'primary.light' : 'text.disabled'}
                  >
                    {item.title}
                  </Typography>

                  <Stack
                    height="100%"
                    width={20}
                    position="absolute"
                    left={4}
                    top={0}
                    alignItems="center"
                  >
                    <Divider
                      orientation="vertical"
                      sx={{
                        borderColor: isActive ? 'primary.light' : 'transparent',
                      }}
                    />
                  </Stack>
                </ListItemButton>
              </Link>
            );
          })}
        </List>

        <Stack
          height="100%"
          width={20}
          position="absolute"
          left={4}
          top={0}
          alignItems="center"
        >
          <Divider orientation="vertical" />
        </Stack>
      </Collapse>
    </>
  );
};
