import { PubSub } from "graphql-subscriptions";
import { Module } from '@nestjs/common';

export const FBG_PUB_SUB = 'FbgPubSub';

@Module({
  providers: [
    {
      provide: FBG_PUB_SUB,
      useFactory: () => {
        // Use in-memory PubSub for single-instance deployment
        // For multi-instance deployments, a distributed pub/sub system would be needed
        return new PubSub();
      }
    },
  ],
  exports: [FBG_PUB_SUB]
})
export class FbgPubSubModule {}
