#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int kindex;
char keys[400][20];

int main()
{

	int i,j;
	FILE *fp,*fp2;
	char str[1024],key[1024];

	kindex = 0;
	fp = fopen("text","r");

	while(fgets(str,1024,fp) != NULL){
		i = j = 0;
		while(i < strlen(str)){
			j = 0;
			while(str[i] != '"' && i < strlen(str))
				 i++;
			i++;
			while(str[i] != '"' && i < strlen(str)){
				key[j] = str[i];
				j++;
				i++;
			}
			key[j] = '\0';
			if(str[0] != '\n'){
				strcpy(keys[kindex++],key);
			}
			i++;
		}
	}
	fclose(fp);

	for(i = 0; i < kindex; ++i)
		printf("%s\n",keys[i]);

	return 0;
}
