import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Workspace } from '../../../workspace/entities/workspace.entity';

@Entity('models_3d')
@Index(['workspaceId'])
export class Model3D extends BaseEntity {
  @Column() name: string;
  @Column() s3Key: string;
  @Column() format: string; // glb, fbx, usdz, obj
  @Column() prompt?: string;
  @Column() aiModel?: string;
  @Column() workspaceId: string;
  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;
}
