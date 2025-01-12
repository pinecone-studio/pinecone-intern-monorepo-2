import { Divider, List, ListItem, Stack, Typography } from '@mui/material';

type ReferencesProps = {
  items: {
    label: string;
    path: string;
    description: string;
  }[];
};

export const References = ({ items }: ReferencesProps) => {
  return (
    <Stack py={2} gap={2}>
      <Typography variant="subtitle1" fontWeight="bold">
        To learn more, visit the following resources:
      </Typography>

      <Divider />

      <Stack pl={2}>
        <List sx={{ listStyleType: 'disc' }}>
          {items.map(({ label, path, description }) => {
            return (
              <ListItem key={path} sx={{ display: 'list-item' }}>
                <Typography>
                  <Typography target="_blank" component="a" color="primary.light" href={path}>
                    {label}
                  </Typography>{'   '}
                  {description}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </Stack>
  );
};
