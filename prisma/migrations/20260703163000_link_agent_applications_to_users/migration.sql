ALTER TABLE "AgentApplication" ADD COLUMN "userId" TEXT;

CREATE UNIQUE INDEX "AgentApplication_userId_key" ON "AgentApplication"("userId");

ALTER TABLE "AgentApplication"
ADD CONSTRAINT "AgentApplication_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
